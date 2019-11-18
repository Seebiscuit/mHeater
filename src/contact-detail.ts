import { EventAggregator } from "aurelia-event-aggregator";
import { inject } from 'aurelia-framework';
import { WebAPI } from "./web-api"; 
import { areEqual } from "./utility";
import { ContactUpdated, ContactViewed } from "./messages";

interface Contact {
  firstName: string
  lastName: string
  email: string
}

@inject(WebAPI, EventAggregator)
export class ContactDetail {
  routeConfig
  contact: Contact
  originalContact: Contact

  constructor(private api: WebAPI, private ea: EventAggregator) {} 

  async activate(params, routeConfig) {
    this.routeConfig = routeConfig

    this.contact = <Contact> (await this.api.getContactDetails(params.id))
    
    this.routeConfig.navModel.setTitle(this.contact.firstName)

    this.originalContact = JSON.parse(JSON.stringify(this.contact))

    this.ea.publish(new ContactViewed(this.contact))

    return this.contact
  }

  get canSave() {
    return this.contact.firstName && this.contact.lastName && !this.api.isRequesting
  }

  async save() {
    this.contact = <Contact> (await this.api.saveContact(this.contact))

    this.routeConfig.navModel.setTitle(this.contact.firstName)

    this.originalContact = JSON.parse(JSON.stringify(this.contact))

    this.ea.publish(new ContactUpdated(this.contact))
  }

  canDeactivate() {
    if (!areEqual(this.originalContact, this.contact)) {
      let result = confirm('You have unsaved changes. Are you sure you want to leave?')

      if (!result) {
        this.ea.publish(new ContactViewed(this.contact))
      }

      return result
    }

    return true
  }
}