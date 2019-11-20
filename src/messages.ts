export class ContactUpdated {
  constructor(public contact) {}
}

export class ContactViewed {
  constructor(public contact) {}
}

export class HeatmapUpdated {
  constructor(public coordMap) {}
}