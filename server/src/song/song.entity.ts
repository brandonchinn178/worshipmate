import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

class TimeSignature {
  @Column()
  top: number

  @Column()
  bottom: number
}

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  slug: string

  @Column()
  title: string

  // @Column()
  // artist: string

  // @Column()
  // themes: string[]

  @Column()
  recommendedKey: string

  @Column((_type) => TimeSignature)
  timeSignature: TimeSignature

  @Column()
  bpm: number
}
