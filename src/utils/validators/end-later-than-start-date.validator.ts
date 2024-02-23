import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { PreconditionFailedException } from '@nestjs/common';

@ValidatorConstraint({ name: 'EndLaterThanStartDateValidator', async: true })
export class EndLaterThanStartDateValidator
	implements ValidatorConstraintInterface
{
	validate(date: Date, args: ValidationArguments) {
		try {
			const startDateAttribute = args.constraints[0];
			return date > args.object[startDateAttribute];
		} catch (error) {
			error.status = 422;
			throw new PreconditionFailedException(error);
		}
	}

	defaultMessage(): string {
		return `End date should be later than start date`;
	}
}
