import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ThousandSeparatorDirective } from '../../../shared/directives/thousand-separator.directive';
@Component({
  selector: 'app-nadlan-form',
  imports: [CommonModule, ReactiveFormsModule, ThousandSeparatorDirective],
  templateUrl: './nadlan-form.component.html',
  styleUrl: './nadlan-form.component.scss'
})


export class NadlanFormComponent {


  step2Form: any;
  step3Form: any;
  step4Form: any;

  activeStep = 4;
  today: string;

  constructor(private fb: FormBuilder) {
    const t = new Date();
    this.today = t.toISOString().substring(0, 10); // For entry date default value

    this.step2Form = this.fb.group({
      propertyType: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      street: ['', [Validators.required, Validators.minLength(2)]],
      houseNumber: ['', [
        Validators.required,
        Validators.pattern(/^[1-9]\d*$/)
      ]],
      floor: ['', [
        Validators.required,
        Validators.pattern(/^[1-9]\d*$/),
        Validators.min(1)
      ]],
      totalFloors: ['', [
        Validators.required,
        Validators.pattern(/^[1-9]\d*$/),
        Validators.min(1)
      ]]
    }, {
      validators: this.floorLessThanOrEqualTotal
    });

    this.step3Form = this.fb.group({
      rooms: ['', [Validators.required]],
      description: ['', [Validators.required]]  // ← your free-text field, no validators = optional
    })

    this.step4Form = this.fb.group({
      size: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      price: ['', [Validators.required]],
    })
  }


  // getters for template
  get propertyType() { return this.step2Form.get('propertyType')!; }
  get city() { return this.step2Form.get('city')!; }
  get street() { return this.step2Form.get('street')!; }
  get houseNumber() { return this.step2Form.get('houseNumber')!; }
  get floor() { return this.step2Form.get('floor')!; }
  get totalFloors() { return this.step2Form.get('totalFloors')!; }

  get rooms() { return this.step3Form.get('rooms'); }
  get description() { return this.step3Form.get('description'); }

  get size() { return this.step4Form.get('size'); }
  get price() { return this.step4Form.get('price'); }

  get pricePerSqm(): number {
    const rawPrice = this.step4Form.get('price')?.value;
    const rawSize = this.step4Form.get('size')?.value;

    const priceStr = rawPrice != null ? rawPrice.toString() : '0';
    const sizeStr = rawSize != null ? rawSize.toString() : '1';

    const priceNum = parseFloat(priceStr.replace(/[^\d.-]/g, '')) || 0;
    const sizeNum = parseFloat(sizeStr.replace(/[^\d.-]/g, '')) || 1;

    return sizeNum > 0 ? priceNum / sizeNum : 0;
  }


  onSubmitStep2() {
    if (this.step2Form.valid) {
      this.activeStep++;
    }
    else {
      this.step2Form.markAllAsTouched();
      return;
    }
  }
  onSubmitStep3() {
    if (this.step3Form.valid) {
      this.activeStep++;
    }
    else {
      this.step3Form.markAllAsTouched();
      return;
    }
  }

  onSubmitStep4() {
    const priceCtrl = this.step4Form.get('price')!;
    const sizeCtrl = this.step4Form.get('size')!;
    if (sizeCtrl.valid) {
      // 1) grab the raw value, turn to string
      const raw = priceCtrl.value;
      const str = raw != null
        ? raw.toString()
        : '';

      // 2) strip out non-digits
      const cleaned = str.replace(/[^\d.-]/g, '');

      // 3) set it back as a number
      priceCtrl.setValue(cleaned === '' ? '' : parseFloat(cleaned));

      if (this.step4Form.valid) {
        this.activeStep++;
      }
    }
    else {
      this.step4Form.markAllAsTouched();
      return;
    }
  }


  floorLessThanOrEqualTotal(c: AbstractControl): ValidationErrors | null {
    const floor = +c.get('floor')?.value;
    const totalFloors = +c.get('totalFloors')?.value;
    return floor > totalFloors
      ? { floorExceedsTotal: true }
      : null;
  }

  onBack() {
    if (this.activeStep == 2)
      window.history.back();
    else
      this.activeStep--;
  }
}