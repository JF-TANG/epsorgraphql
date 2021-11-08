import { ObjectType, Field, ID, Int } from "type-graphql"
import { Entity, BaseEntity, ObjectIdColumn, Column } from "typeorm"
import { ObjectID } from "mongodb"
@ObjectType()
@Entity()
export class Book extends BaseEntity {
	@Field(() => ID)
	@ObjectIdColumn()
	id: ObjectID

	@Field()
	@Column()
	name: string

	@Field(() => Int)
	@Column()
	numberOfPages: number
}
