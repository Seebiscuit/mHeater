import * as localforage from "localforage";
import { Point } from "./interfaces/Point";
import { sortPoint } from "./utility";

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

export class WebAPI {
  isRequesting = false;

  constructor() {
    localforage.config({ name: 'm-heat'})
  }

  async saveHeatMap(point: Point | Array<Point>) {
    let previousCoords = <Array<Point>> (await this.getHeatMap())

    if (!previousCoords) previousCoords = []

    if (Array.isArray(point)) {
      previousCoords = previousCoords.concat(point)
    } else {
      previousCoords.push(point)
    }

    if (previousCoords.length >= MAX_COORD_SET * 1.1) {debugger
      previousCoords = previousCoords.slice(0, MAX_COORD_SET)
    }

    previousCoords.sort(sortPoint)

    localforage.setItem("points", previousCoords)

    return previousCoords
  }

  async getHeatMap() {
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