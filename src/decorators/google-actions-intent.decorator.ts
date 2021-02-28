import 'reflect-metadata';
import { applyParamsMetadataDecorator } from '../utils';
import { GOOGLE_ACTION_INTENT, GOOGLE_ACTION_PARAMS } from '../constant';

export const GoogleActionsIntent = (intent: string) => {
	return (target: Object, key: string | symbol, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;
		descriptor.value = function(...args: any[]) {
			const paramsMetadata = (Reflect.getMetadata(GOOGLE_ACTION_PARAMS, target) || []).filter(p => {
				return p.key === key;
			});
			return originalMethod.apply(this, applyParamsMetadataDecorator(paramsMetadata, args));
		};

		/* Apply the intent value on the descriptor to be handled. */
		Reflect.defineMetadata(GOOGLE_ACTION_INTENT, intent, descriptor.value);
		return descriptor;
	};
};
