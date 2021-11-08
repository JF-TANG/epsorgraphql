import { ObjectType, Field, ID, Float, Int } from "type-graphql"
import { Entity, BaseEntity, ObjectIdColumn, Column } from "typeorm"
import { ObjectID } from "mongodb"
@ObjectType() //ObjectType decorator, to tell that our class represent a Graphql object type
@Entity() //Entity decorator, to tell that our class represent an database entity
export class Product extends BaseEntity {
	//We make our class extends to baseEntity, like that we can access method like (find, findOne, …)
	@Field(() => ID) //Field decorator, represent a Graphql field of our graphql object type (Here we precised () => ID, to tell to graphql that it’s the actual id of the entity)
	@ObjectIdColumn() //Special decorator, to tell that this column represent an unique generated ID
	id: ObjectID
	@Field()
	@Column() //Here we are telling that this property represent a database column
	productName: string
	@Field()
	@Column()
	description: string
	@Field(() => Float)
	@Column()
	price: number
	@Field(() => Int)
	@Column()
	numberInStock: number
}
