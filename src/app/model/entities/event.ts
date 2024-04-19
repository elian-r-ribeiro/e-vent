export class Event {
    private _eventTitle: string;
    private _eventDesc: string;
    private _eventImg: string;
    private _maxParticipants: number;
    private _ownerName!: string;
    private _ownerImage!: string;

    constructor(eventTitle: string, eventDesc: string, eventImg: string, maxParticipants: number){
        this._eventTitle = eventTitle;
        this._eventDesc = eventDesc;
        this._eventImg = eventImg;
        this._maxParticipants = maxParticipants;
    }

    public get eventTitle(): string {
        return this._eventTitle;
    }
    public set eventTitle(value: string) {
        this._eventTitle = value;
    }

    public get eventDesc(): string {
        return this._eventDesc;
    }
    public set eventDesc(value: string) {
        this._eventDesc = value;
    }

    public get eventImg(): string {
        return this._eventImg;
    }
    public set eventImg(value: string) {
        this._eventImg = value;
    }

    public get maxParticipants(): number {
        return this._maxParticipants;
    }
    public set maxParticipants(value: number) {
        this._maxParticipants = value;
    }

    public get ownerName(): string {
        return this._ownerName;
    }
    public set ownerName(value: string) {
        this._ownerName = value;
    }

    public get ownerImage(): string {
        return this._ownerImage;
    }
    public set ownerImage(value: string) {
        this._ownerImage = value;
    }
}
