import { EventAggregator } from "aurelia-event-aggregator";
import { WebAPI } from "./web-api";
import { ContactUpdated, ContactViewed } from "./messages";
import { inject } from "aurelia-framework";

@inject(WebAPI, EventAggregator)
export class ContactList {
  contacts
  selectedId = 0

  constructor(private api: WebAPI, private ea: EventAggregator) {
    ea.subscribe(ContactViewed, msg => this.select(msg.contact))    
    ea.subscribe(ContactUpdated, msg => {
      const id = msg.contact.id
      let found = this.contacts.find(c => c.id === id)

      Object.assign(found, msg.contact)
    })    
  }

  async created() {
    this.contacts = await this.api.getContactList()
  }

  select(contact) {
    this.selectedId = contact.id

    return true
  }
}