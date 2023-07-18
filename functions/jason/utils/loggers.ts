// deno-lint-ignore-file
import {red,blue,green,yellow, bold} from "https://deno.land/std@0.194.0/fmt/colors.ts";

export function logNormal(message: string, data?: any) {

    console.log(blue(`${message}`))
    data && console.log(data);
}


export function logSuccess(message: string, data?: any) {
    console.log(green(`Success: ${message}`));
    data && console.log(data);
}

export function logWarning(message: string, data?: any) {
    console.log(yellow(`Warning: ${message}`));
    data && console.log(data);
}
export function logInfo(message: string, data?: any) {
    console.log(bold(blue(`Info: ${message}`)));
    data && console.log(data);
}

export function logError(message: string, data?: any) {
    console.log(red(`Error: ${message}`));
    data && console.log(data);
}

