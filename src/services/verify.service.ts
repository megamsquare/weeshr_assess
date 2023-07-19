import Model from "../models";
import Err from "../use_cases/error_handler";

function generateNumber(min:number, max: number) {
    const random = Math.floor(Math.random() * (max - min) + min);
    return random;
}