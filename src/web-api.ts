import { HeatmapUpdated } from './messages';
import { EventAggregator } from 'aurelia-event-aggregator';
import * as localforage from "localforage";
import { Point } from "./interfaces/Point";
import { inject } from "aurelia-framework";

let latency = 200;
let id = 0;

function getId(){
  return ++id;
}

let contacts = [
  {
    id:getId(),
    firstName:'John',
    lastName:'Tolkien',
    email:'tolkien@inklings.com',
    phoneNumber:'867-5309'
  },
  {
    id:getId(),
    firstName:'Clive',
    lastName:'Lewis',
    email:'lewis@inklings.com',
    phoneNumber:'867-5309'
  },
  {
    id:getId(),
    firstName:'Owen',
    lastName:'Barfield',
    email:'barfield@inklings.com',
    phoneNumber:'867-5309'
  },
  {
    id:getId(),
    firstName:'Charles',
    lastName:'Williams',
    email:'williams@inklings.com',
    phoneNumber:'867-5309'
  },
  {
    id:getId(),
    firstName:'Roger',
    lastName:'Green',
    email:'green@inklings.com',
    phoneNumber:'867-5309'
  }
];

const MAX_COORD_SET = 10E3

@inject(EventAggregator)
export class WebAPI {
  isRequesting = false;

  constructor(private ea: EventAggregator) {
    localforage.config({ name: 'm-heat'})
  }

  async saveHeatMap(point: Point | Array<Point>): Promise<Array<Point> | null> {
    let previousCoords = <Array<Point>> (await this.getHeatMap())

    if (!previousCoords) previousCoords = []

    if (Array.isArray(point)) {
      previousCoords = previousCoords.concat(point)
    } else {
      previousCoords.push(point)
    }

    if (previousCoords.length >= MAX_COORD_SET * 1.1) {
      previousCoords = previousCoords.slice(MAX_COORD_SET * 0.1)
    }

    localforage.setItem("points", previousCoords)

    this.ea.publish(new HeatmapUpdated(previousCoords))
    console.info("Coords Saved! Total points:", previousCoords.length)    
    return previousCoords
  }

  async getHeatMap(): Promise<Array<Point> | null> {
    return await localforage.getItem("points")
  }
  
  getContactList(){
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let results = contacts.map(x =>  { return {
          id:x.id,
          firstName:x.firstName,
          lastName:x.lastName,
          email:x.email
        }});
        resolve(results);
        this.isRequesting = false;
      }, latency);
    });
  }

  getContactDetails(id){
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let found = contacts.filter(x => x.id == id)[0];
        resolve(JSON.parse(JSON.stringify(found)));
        this.isRequesting = false;
      }, latency);
    });
  }

  saveContact(contact){
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let instance = JSON.parse(JSON.stringify(contact));
        let found = contacts.filter(x => x.id == contact.id)[0];

        if(found){
          let index = contacts.indexOf(found);
          contacts[index] = instance;
        }else{
          instance.id = getId();
          contacts.push(instance);
        }

        this.isRequesting = false;
        resolve(instance);
      }, latency);
    });
  }
}