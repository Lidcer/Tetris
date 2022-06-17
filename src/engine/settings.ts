export class Settings {
    gravity = 0.0005;
    bagItemsCount = 5; 
    shadowPiece = true;
    allow180 = true;
    rotationSystem: "none" | "SRS" = "SRS";
    handling = {
        DAS: 200,
        ARR: 50,
        SDF: 50,
        //DSD: 500
    };
}

export interface HandlingSettings {
    DAS: number;
    ARR: number;
    SDF: number;
    //DSD: number;
}