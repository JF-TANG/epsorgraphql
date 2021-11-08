import { Resolver, Query, Mutation, Arg } from "type-graphql"
import { Product } from "../entities/Product"
@Resolver() //Tell that this class represent a resolver
export class ProductResolver {
	@Query(() => [Product]) //Tell that this function represent a query resolver, “()=>[Product]” define the return type of this operation, here it’s an array of Products
	async products(): Promise<Product[]> {
		return await Product.find() // .find() is an TYPEORM method to find all database records related to our products
	}

	@Mutation(() => Product!) // Create a new mutation that will return a product
	async addProduct(
		@Arg("productName") productName: string, // @ Arg() define a new argument for the query (here we are adding one for each properties of the product entity )
		@Arg("description") description: string,
		@Arg("price") price: number,
		@Arg("numberInStock") numberInStock: number
	): Promise<Product> {
		const product = Product.create({
			// We are creating a new product record with all the args field
			productName,
			description,
			price,
			numberInStock,
		})
		return await product.save() // We are saving our new product to the database and returning the result
	}

	@Query(() => Product!, { nullable: true })
	async findProductByID(
		@Arg("productID") productID: string
	): Promise<Product | undefined | null> {
		return await Product.findOne(productID)
	}

	@Mutation(() => Product!, { nullable: true })
	async deleteProductByID(
		@Arg("productID") productID: string
	): Promise<Product | undefined | null> {
		//const allProduct = await getRepository(Product)
		const product = await Product.findOne(productID)
		if (product) {
			await Product.delete(productID)
			return product
		}
		return null
	}

	@Mutation(() => Product!)
	async updateProduct(
		@Arg("productID") productID: string,
		@Arg("productName") productName: string,
		@Arg("description") description: string,
		@Arg("price") price: number,
		@Arg("numberInStock") numberInStock: number
	): Promise<Product | null> {
		let product = await Product.findOne(productID)
		if (product) {
			product.productName = productName
			product.description = description
			product.price = price
			product.numberInStock = numberInStock
			await Product.update(productID, product)
			return product
		}
		return null
	}
}
