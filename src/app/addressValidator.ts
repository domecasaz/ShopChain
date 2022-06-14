import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { ethers } from "ethers";

export function addressValidator() : ValidatorFn {
    return (control : AbstractControl) : ValidationErrors | null => {
        return ethers.utils.isAddress(control.value) ? null : {isAddress: {value: control.value}};
    }
}