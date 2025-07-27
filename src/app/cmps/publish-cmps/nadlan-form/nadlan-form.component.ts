import * as UC from '@uploadcare/file-uploader';
import "@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css"

import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ThousandSeparatorDirective } from '../../../shared/directives/thousand-separator.directive';
import House from '../../../models/house';
import { UserService } from '../../../services/user.service';
import { HouseService } from '../../../services/house.service';
import { VehicleService } from '../../../services/vehicle.service';
import { Router } from '@angular/router';


// register the Uploadcare custom elements
UC.defineComponents(UC);

@Component({
  selector: 'app-nadlan-form',
  imports: [CommonModule, ReactiveFormsModule, ThousandSeparatorDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './nadlan-form.component.html',
  styleUrl: './nadlan-form.component.scss'
})


export class NadlanFormComponent implements AfterViewInit {

  private houseService = inject(HouseService)
  private userService = inject(UserService)
  private router = inject(Router)

  uploadedUrls: string[] = [];
  showUploadError = false;


  onAllUploaded(entries: any[]) {
    this.uploadedUrls = entries.map(entry => entry.cdnUrl);
  }
  onCollectionChanged(state: any) {
    this.uploadedUrls = state.successEntries.map((f: any) => f.cdnUrl);
    this.showUploadError = !(this.uploadedUrls.length > 0);


  }

  @ViewChild('ucConfig', { read: ElementRef }) ucConfig!: ElementRef;

  ngAfterViewInit() {
    // override the English locale's "upload-files" label
    this.ucConfig.nativeElement.localeDefinitionOverride = {
      en: {
        'upload-files': 'בחר קבצים',     // your custom text here
        'drop-files-here': 'גרור קבצים לכאן',
        'src-type-local': 'חפש במכשיר',
        'src-type-from-url': 'הזן קישור לתמונה',
        'start-from-cancel': 'חזור',
        clear: 'נקה',
        'caption-from-url': 'צרף קישור לתמונה',
        'upload-url': 'בצע',
        done: 'סיים',
        'add-more': 'הוסף עוד',
        'header-succeed': '{{count}} קבצים הועלו בהצלחה',
        'header-uploading': 'מעלה {{count}} קבצים',
        'files-count-limit-error-too-many': 'בחרת יותר מדי קבצים. {{max}} זה המקסימום.',
      }
    };
  }

  step2Form: any;
  step3Form: any;
  step4Form: any;
  step6Form: any;

  activeStep = 2;
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

    this.step6Form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),            // at least 2 characters
          Validators.pattern(/^[\p{L} '-]+$/u) // letters, spaces, apostrophes/hyphens
        ]
      ],
      phone: [
        '',
        [
          Validators.required,
          // e.g. Israeli mobile: 050-1234567 or 0521234568 (9 digits plus leading zero)
          Validators.pattern(/^0[2-9]\d{7,8}$/)
        ]
      ],
    });
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

  get name() { return this.step6Form.get('name') }
  get phone() { return this.step6Form.get('phone') }

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

  onSubmitStep5() {
    if (this.uploadedUrls.length === 0) {
      this.showUploadError = true;
      return;
    }
    this.showUploadError = false;
    this.activeStep++;

  }

  onSubmitStep6() {
    if (this.step6Form.valid) {
      // instead of immediately going to the next step:
      const ok = window.confirm('האם אתה בטוח שאתה רוצה לפרסם את המודעה?');
      if (ok) {
        const house: House = {
          _id: '',                                   // leave blank, your backend can assign
          ownerId: this.userService.getLoggedinUser()?._id!,                    // replace with your actual user id
          street: this.step2Form.value.street,
          number: +this.step2Form.value.houseNumber,
          city: this.step2Form.value.city,
          rooms: +this.step3Form.value.rooms,
          size: +this.step4Form.value.size,
          price: +this.step4Form.value.price,
          phoneNumber: this.step6Form.value.phone,
          datePosted: new Date(),
          description: this.step3Form.value.description,
          images: this.uploadedUrls,
          type: this.step2Form.value.propertyType,
          floor: +this.step2Form.value.floor,
          totalFloors: +this.step2Form.value.totalFloors
        };

        this.houseService.create(house).subscribe({
          next: createdHouse => {
            console.log('House created:', createdHouse);
          },
          error: err => {
            console.error('Failed to create house', err);
          }
        });

        this.router.navigate(['/home']).then(() => {
          window.location.reload();
        });

      }
    } else {
      this.step6Form.markAllAsTouched();
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