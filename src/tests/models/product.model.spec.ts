import { ProductModel,Product } from "../../models/product.model";
import client from "../../database";

const productModel = new ProductModel();

describe("make sure that all product CRUD function are defined",()=>{
  it("create new product is defined",():void=>{
    expect(productModel.create).toBeDefined();
  });

  it("get all products is defined",():void=>{
    expect(productModel.index).toBeDefined();
  });

  it("get one product is defined",():void=>{
    expect(productModel.getOne).toBeDefined();
  });

  it("update product is defined",():void=>{
    expect(productModel.update).toBeDefined();
  });

  it("delete product is defined",():void=>{
    expect(productModel.delete).toBeDefined();
  });

});

describe("Test functionality of all CRUD opreation for Product Model",()=>{
  const product:Product = {
    name:"test-product",
    cat:"test",
    price:10,
  }
  const product2:Product = {
    name:"test-product2",
    cat:"test2",
    price:10,
  }
  it("create new product",async():Promise<void>=>{
    const productCountBefore = (await productModel.index()).length
    const newProduct = await productModel.create(product);
    const productCountAfter = (await productModel.index()).length
    product.id = newProduct.id;
    expect(newProduct.name).toEqual(product.name);
    expect(newProduct.price).toEqual(product.price);
    expect(productCountAfter).toEqual(productCountBefore +1);
  });    

  it("get all product",async():Promise<void>=>{
    const users = await productModel.index();
    expect(users.length).toBe(1);
  });

  it("get user by id ",async():Promise<void>=>{
    const resProduct = await productModel.getOne(product.id!);
    expect(resProduct.name).toEqual(product.name);
    expect(resProduct.price).toEqual(product.price);
 
  });

  it("update user ",async():Promise<void>=>{
    let updatedInfo:Product = {
      name:"update-test",
      price:10,
    }
    const oldProduct = await productModel.getOne(product.id!);
    updatedInfo.id = oldProduct.id;
    const updatedProduct = await productModel.update(updatedInfo);
    expect(updatedProduct.name).toEqual(updatedInfo.name);
    expect(updatedProduct.price).toEqual(updatedInfo.price);
  });

  it("gets product bt catgory",async():Promise<void>=>{
    const testCat = await productModel.getProductsByCat("test");
    await productModel.create(product2);
    const test2Cat = await productModel.getProductsByCat("test2");
    expect(testCat.length).toBe(1);
    expect(testCat[0].id).toBe(product.id);
    expect(test2Cat.length).toBe(1);
    expect(test2Cat[0].name).toBe("test-product2");
  })
  it("delete product by  id ",async():Promise<void>=>{
    const productCountBefore = (await productModel.index()).length;
    const deletedProduct = await productModel.delete(product.id!);
    const productCountAfter = (await productModel.index()).length;
    expect(productCountAfter).toBe(productCountBefore - 1);
    expect(deletedProduct.id).toBe(product.id)
  });

 afterAll(async():Promise<void>=>{
   const connection = await client.connect();
   const sql = "DELETE FROM products;ALTER SEQUENCE products_id_seq RESTART WITH 1;";
   connection.query(sql);
   connection.release();
 })
})