/**
 * Add the service methods to meteor
 * =================================
 */
import {Chatpal} from '../base/backend';

Meteor.methods({
	'chatpal.search.search'(text, page, filters) {
		try {
			return Chatpal.service.SearchService.search(text, page, filters);
		} catch (e) {console.log(e);
			throw new Meteor.Error("chatpal-error", e);
		}
	}
});

Meteor.methods({
	'chatpal.config.set'(config) {
		//stop all services
		Object.keys(Chatpal.service).forEach((key) => {
			Chatpal.service[key].stop();
		});

		//test settings
		Chatpal.Backend.init(config);

		if (!Chatpal.Backend.enabled) { throw new Error('cannot enable chatpal backend'); }

		//make settings
		//check if config already exists
		const settings = RocketChat.models.Settings.findById('CHATPAL_CONFIG').fetch();console.log(settings);
		if (settings && settings.length>0) {
			RocketChat.models.Settings.updateValueById('CHATPAL_CONFIG', config);
		} else {
			RocketChat.models.Settings.createWithIdAndValue('CHATPAL_CONFIG', config);
		}

		//start all services
		Object.keys(Chatpal.service).forEach((key) => {
			Chatpal.service[key].start();
		});
	}
});

Meteor.methods({
	'chatpal.config.get'() {
		const config = RocketChat.models.Settings.findById('CHATPAL_CONFIG').fetch();
		return (config && config.length > 0) ? config[0].value : undefined;
	}
});

Meteor.methods({
	'chatpal.utils.validatekey'(key) {
		return key === '123';//TODO
	}
});
