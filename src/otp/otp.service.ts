import { Injectable } from '@nestjs/common';
import { CreateOTPDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
	DeepPartial,
	FindOptionsRelations,
	FindOptionsWhere,
	Repository,
} from 'typeorm';
import { OTP } from './entities/otp.entity';

@Injectable()
export class OtpService {
	constructor(
		@InjectRepository(OTP)
		private readonly otpRepository: Repository<OTP>,
	) {}

	async create(createOtpDto: CreateOTPDto): Promise<OTP> {
		const otp = this.otpRepository.create(createOtpDto as DeepPartial<OTP>);
		return await this.otpRepository.save(otp);
	}

	async findOne(
		field: FindOptionsWhere<OTP>,
		relations?: FindOptionsRelations<OTP>,
	) {
		return await this.otpRepository.findOne({ where: field, relations });
	}

	async findOneOrFail(
		field: FindOptionsWhere<OTP>,
		relations?: FindOptionsRelations<OTP>,
	) {
		return await this.otpRepository.findOneOrFail({
			where: field,
			relations,
		});
	}

	async update(
		id: number,
		otp: OTP,
		updateOtpDto: UpdateOtpDto,
	): Promise<OTP> {
		Object.assign(otp, updateOtpDto);
		return this.otpRepository.save(otp);
	}

	remove(id: number) {
		return `This action removes a #${id} otp`;
	}
}
