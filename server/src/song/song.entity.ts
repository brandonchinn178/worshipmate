import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType()
class TimeSignature {
  @Column()
  @Field(() => Int)
  top: number

  @Column()
  @Field(() => Int)
  bottom: number
}

@Entity()
@ObjectType()
export class Song {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number

  @Column({ unique: true })
  @Field()
  slug: string

  @Column()
  @Field()
  title: string

  // @Column()
  // artist: string

  // @Column()
  // themes: string[]

  @Column()
  @Field()
  recommendedKey: string

  @Column((_type) => TimeSignature)
  @Field()
  timeSignature: TimeSignature

  @Column()
  @Field(() => Int)
  bpm: number
}
