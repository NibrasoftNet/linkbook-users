import * as bcrypt from 'bcryptjs';
import {
	AfterLoad,
	BeforeInsert,
	BeforeUpdate,
	Column,
	DeleteDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthProvidersEnum } from '../../auth/enums/auth-providers.enum';
// eslint-disable-next-line import/no-cycle
import { Community } from '../../community/entities/community.entity';
import {
	Directive,
	Field,
	ID,
	ObjectType,
	registerEnumType,
} from '@nestjs/graphql';
import { EntityHelper } from '../../utils/entities/entity-helper';
import { Exclude, Expose } from 'class-transformer';
import { Role } from '../../roles/entities/role.entity';
import { Status } from '../../statuses/entities/status.entity';
import { UsersFileEntity } from '../../file/entities/users-file.entity';

registerEnumType(AuthProvidersEnum, { name: 'AuthProvidersEnum' });

@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class User extends EntityHelper {
	@Field(() => ID) // Decorate with @Field(() => ID) for GraphQL
	@PrimaryGeneratedColumn()
	id: number;

	@Field(() => String, { nullable: true })
	@Column({ type: 'varchar', unique: true, nullable: true })
	@Expose({ groups: ['me', 'admin'] })
	email: string | null;

	@Field(() => String, { nullable: true })
	@Column({ nullable: true, type: 'varchar' })
	@Exclude({ toPlainOnly: true })
	password: string;

	@Exclude({ toPlainOnly: true })
	public previousPassword: string;

	@Field(() => AuthProvidersEnum)
	@Column({ type: 'varchar', default: AuthProvidersEnum.email })
	@Expose({ groups: ['me', 'admin'] })
	provider: string;

	@Field(() => String, { nullable: true })
	@Column({ type: 'varchar', nullable: true })
	@Expose({ groups: ['me', 'admin'] })
	socialId: string | null;

	@Field(() => String, { nullable: true })
	@Column({ type: 'varchar', nullable: true })
	firstName: string | null;

	@Field(() => String, { nullable: true })
	@Column({ type: 'varchar', nullable: true })
	lastName: string | null;

	@Field(() => UsersFileEntity, { nullable: true })
	@OneToOne(() => UsersFileEntity, (file) => file, {
		eager: true,
		nullable: true,
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	image?: UsersFileEntity;

	@Field(() => String)
	@Index()
	@Column({ type: 'varchar', nullable: true, unique: true })
	@Expose({ groups: ['me', 'admin'] })
	phone: string;

	@Field(() => Role, { nullable: true })
	@ManyToOne(() => Role, { eager: true, nullable: true })
	@Expose({ groups: ['me', 'admin'] })
	role?: Role | null;

	@Field(() => Status, { nullable: true })
	@ManyToOne(() => Status, { eager: true, nullable: true })
	status?: Status;

	@Field(() => Date, { nullable: true })
	@DeleteDateColumn()
	deletedAt: Date;

	@ManyToOne(() => Community, (community) => community.members, {
		nullable: true,
	})
	communities?: Community[];

	@AfterLoad()
	public loadPreviousPassword(): void {
		this.previousPassword = this.password;
	}

	@BeforeInsert()
	@BeforeUpdate()
	async setPassword() {
		if (this.previousPassword !== this.password && this.password) {
			const salt = await bcrypt.genSalt();
			this.password = await bcrypt.hash(this.password, salt);
		}
	}
}
