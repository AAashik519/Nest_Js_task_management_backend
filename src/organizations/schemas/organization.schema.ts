import { Prop, Schema } from "@nestjs/mongoose";
import { IsNotEmpty } from "class-validator";


@Schema({timestamps: true})

export class Organization {
    @Prop({ required: true })
    @IsNotEmpty()
    name!: string;

    

}
