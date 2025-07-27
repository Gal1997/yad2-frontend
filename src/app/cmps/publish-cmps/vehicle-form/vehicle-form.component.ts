import * as UC from '@uploadcare/file-uploader';
import "@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css"
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ThousandSeparatorDirective } from '../../../shared/directives/thousand-separator.directive';
import { UserService } from '../../../services/user.service';
import { HouseService } from '../../../services/house.service';
import { VehicleService } from '../../../services/vehicle.service';
import { finalize } from 'rxjs';
import Vehicle from '../../../models/vehicle';
import { Router } from '@angular/router';


// register the Uploadcare custom elements
UC.defineComponents(UC);

@Component({
  selector: 'app-vehicle-form',
  imports: [CommonModule, ReactiveFormsModule, ThousandSeparatorDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.scss'
})


export class VehicleFormComponent implements AfterViewInit {

  private houseService = inject(HouseService)
  private userService = inject(UserService)

  noVehicleFound = false;
  isLoadingVehicleNumber = false;
  vehicleInfo: any[] = [];
  uploadedUrls: string[] = [];
  showUploadError = false;
  currentYear = new Date().getFullYear();
  private router = inject(Router)

  colors = [
    { name: 'שחור', hex: '#000000', value: 'שחור' },
    { name: 'לבן', hex: '#ffffff', value: 'לבן' },
    { name: 'אפור', hex: '#999999', value: 'אפור' },
    { name: 'צהוב', hex: '#FFC107', value: 'צהוב' },
    { name: 'כחול', hex: '#0066CC', value: 'כחול' },
    { name: 'אדום', hex: '#ff0000ff', value: 'אדום' },
    { name: 'כתום', hex: '#FF9800', value: 'כתום' },
    { name: 'ירוק', hex: '#059f00ff', value: 'ירוק' },
    { name: 'חום', hex: '#6f493bff', value: 'חום' },
    { name: 'ורוד', hex: '#E91E63', value: 'ורוד' },
    { name: 'סגול', hex: '#9C27B0', value: 'סגול' },
  ];




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

  constructor(private fb: FormBuilder, private vehicleService: VehicleService) {
    const t = new Date();
    this.today = t.toISOString().substring(0, 10); // For entry date default value

    this.step2Form = this.fb.group({
      manufacturer: ['', Validators.required],   // ״יצרן״
      model: ['', Validators.required],   // ״דגם״
      year: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/)
      ]],   // ״שנה״
      horsepower: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/)    // only digits
      ]],   // ״כ״ס״
      gearbox: ['', Validators.required]    // ״תיבת הילוכים״
    });

    this.step3Form = this.fb.group({
      color: ['', Validators.required],
      moed_aliya_lakvish: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        Validators.max(this.currentYear),
        Validators.min(1950)
      ]],
      yad: ['', [Validators.required]],
      baalut: ['', [Validators.required]],
      kilometraj: ['', [Validators.required, Validators.max(999999), Validators.min(0)]],
      description: ['', [Validators.required]]


    });

    this.step4Form = this.fb.group({
      location: ['', [Validators.required]],
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

  searchByPlate(plate: string) {
    this.noVehicleFound = false;
    this.isLoadingVehicleNumber = true;
    setTimeout(() => { }, 2000)
    this.vehicleService.lookupByPlate(plate)
      .pipe(
        finalize(() => this.isLoadingVehicleNumber = false)
      )
      .subscribe({
        next: records => {
          console.log('Vehicle lookup result:', records);

          if (!records.length) {
            console.warn('No vehicle found for plate', plate);
            this.noVehicleFound = true;
            this.clearForm()
            this.markAllAsUntouched()
            return;
          }

          const v = records[0];
          this.step2Form.patchValue({
            manufacturer: v.tozeret_nm.split(' ')[0],
            model: v.kinuy_mishari,
            year: v.shnat_yitzur,
          });
          this.step3Form.patchValue({
            color: this.checkIfColorExists(v.tzeva_rechev) ? v.tzeva_rechev : "",
            moed_aliya_lakvish: v.moed_aliya_lakvish.split('-')[0],
            baalut: v.baalut,
          });
          this.markAllAsUntouched()
        },
        error: err => {
          console.error('Lookup error:', err)
          this.clearForm()
          this.markAllAsUntouched()
        },
      })
      ;
  }



  // getters for template
  get manufacturer() { return this.step2Form.get('manufacturer')!; }
  get model() { return this.step2Form.get('model')!; }
  get year() { return this.step2Form.get('year')!; }
  get horsepower() { return this.step2Form.get('horsepower')!; }
  get gearbox() { return this.step2Form.get('gearbox')!; }
  get moed_aliya_lakvish() {
    return this.step3Form.get('moed_aliya_lakvish')!;
  }
  get yad() {
    return this.step3Form.get('yad')!;
  }
  get baalut() {
    return this.step3Form.get('baalut')!;
  }
  get kilometraj() {
    return this.step3Form.get('kilometraj')!;
  }
  get description() { return this.step3Form.get('description'); }
  get location() { return this.step4Form.get('location'); }
  get price() { return this.step4Form.get('price'); }
  get name() { return this.step6Form.get('name') }
  get phone() { return this.step6Form.get('phone') }




  clearForm() {
    this.step2Form.patchValue({
      manufacturer: '',
      model: '',
      year: '',
      horsepower: '',
      gearbox: ''
    });
  }
  markAllAsUntouched() {
    ['manufacturer', 'model', 'year', 'horsepower', 'gearbox'] // This is so validator errors will not trigger after entering vehicle number, specifically on gear + horsepower
      .forEach(field => {
        const ctrl = this.step2Form.get(field);
        if (ctrl) {
          ctrl.markAsUntouched();
          ctrl.markAsPristine();
        }
      })
  }
  checkIfColorExists(color: string) {
    return this.colors.some(c => c.value === color);
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
    const location = this.step4Form.get('location')!;
    if (location.valid) {
      // 1) grab the raw value, turn to string
      const raw = priceCtrl.value;
      const str = raw != null
        ? raw.toString()
        : '';

      // 2) strip out non-digits
      const cleaned = str.replace(/[^\d.-]/g, '');

      // 3) set it back as a number
      priceCtrl.setValue(cleaned === '' ? '' : parseFloat(cleaned));

      console.log(this.step4Form);


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
        const vehicle: Vehicle = {
          _id: '', // backend will assign
          ownerId: this.userService.getLoggedinUser()?._id!,
          degem: this.step2Form.value.model,
          manufacturer: this.step2Form.value.manufacturer,
          year: +this.step2Form.value.year,
          horsepower: +this.step2Form.value.horsepower,
          gearbox: this.step2Form.value.gearbox,
          yad: this.step3Form.value.yad,
          kilometraj: +this.step3Form.value.kilometraj,
          description: this.step3Form.value.description,
          color: this.step3Form.value.color,
          moed_aliya_lakvish: +this.step3Form.value.moed_aliya_lakvish,
          baalut: this.step3Form.value.baalut,
          location: this.step4Form.value.location,
          price: +this.step4Form.value.price,
          ownerName: this.step6Form.value.name,
          ownerPhone: this.step6Form.value.phone,
          images: this.uploadedUrls
        };

        console.log(vehicle);


        this.vehicleService.create(vehicle).subscribe({
          next: createdVehicle => {
            console.log('Vehicle created:', createdVehicle);
          },
          error: err => {
            console.error('Failed to create vehicle', err);
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