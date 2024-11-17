export class Artist {
  id: string;
  name: string;
  grammy: boolean;

  constructor(artistData: Artist) {
    Object.assign(this, artistData);
  }
}
