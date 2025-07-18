import { Schema } from 'mongoose';
export declare const DrugSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    name: string;
    lastFetched: Date;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    name: string;
    lastFetched: Date;
}>> & import("mongoose").FlatRecord<{
    name: string;
    lastFetched: Date;
}> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export declare const DrugMongoModel: import("mongoose").Model<{
    name: string;
    lastFetched: Date;
}, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    name: string;
    lastFetched: Date;
}> & {
    name: string;
    lastFetched: Date;
} & {
    _id: import("mongoose").Types.ObjectId;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    name: string;
    lastFetched: Date;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    name: string;
    lastFetched: Date;
}>> & import("mongoose").FlatRecord<{
    name: string;
    lastFetched: Date;
}> & {
    _id: import("mongoose").Types.ObjectId;
}>>;
