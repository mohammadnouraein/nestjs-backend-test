export class CancelResponse {
  id: string;
  cancelled: boolean;

  constructor(id: string, cancelled: boolean) {
    this.id = id;
    this.cancelled = cancelled;
  }
}
