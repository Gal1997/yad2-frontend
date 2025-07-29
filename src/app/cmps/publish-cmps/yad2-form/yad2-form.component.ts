import * as UC from '@uploadcare/file-uploader';
import "@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css"
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleService } from '../../../services/vehicle.service';
import { ThousandSeparatorDirective } from '../../../shared/directives/thousand-separator.directive';
import Yad2 from '../../../models/yad2';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { Yad2Service } from '../../../services/yad2.service';

// register the Uploadcare custom elements
UC.defineComponents(UC);

@Component({
  selector: 'app-yad2-form',
  imports: [CommonModule, ReactiveFormsModule, ThousandSeparatorDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './yad2-form.component.html',
  styleUrl: './yad2-form.component.scss'
})
export class Yad2FormComponent {
  conditions = [
    { label: 'חדש באריזה', value: 'חדש באריזה' },
    { label: 'כמו חדש', value: 'כמו חדש' },
    { label: 'משומש', value: 'משומש' },
    { label: 'נדרש תיקון', value: 'נדרש תיקון' },
    { label: 'לא רלוונטי', value: 'לא רלוונטי' }
  ];


  selectCondition(value: string) {
    this.itemCondition.setValue(value);
    this.showItemConditionError = false;
  }

  private userService = inject(UserService)
  private router = inject(Router)
  private yad2Service = inject(Yad2Service)

  activeStep = 1;
  firstForm!: any;
  secondForm!: any;
  uploadedUrls: string[] = [];
  showUploadError = false;
  showItemConditionError = false;

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


  constructor(private fb: FormBuilder, private vehicleService: VehicleService) {

    this.firstForm = this.fb.group({
      itemName: ['', Validators.required],
      itemType: ['', Validators.required],
      itemCondition: ['', Validators.required],
      itemDescription: ['', Validators.required],
      itemPrice: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      itemExtraInfoBadge: [''] // Like "חבל לפספס" or "אחריות בתוקף"
    });
    this.secondForm = this.fb.group({
      ownerName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),            // at least 2 characters
          Validators.pattern(/^[\p{L} ']+$/u) // letters and spaces only, no hyphens
        ]
      ],
      ownerPhoneNumber: [
        '',
        [
          Validators.required,
          // Only numbers, Israeli phone: 9-10 digits, starts with 0
          Validators.pattern(/^0\d{8,9}$/)
        ]
      ],
      pickupAddress: [
        '',
        [
          Validators.required,
          // Require at least one comma in the address
          Validators.pattern(/^[\p{L}\d\s,'"-]+,[\p{L}\d\s,'"-]+$/u)
        ]
      ]
    });

  }


  // Getters for form controls
  get itemName() { return this.firstForm.get('itemName'); }
  get itemType() { return this.firstForm.get('itemType'); }
  get itemCondition() { return this.firstForm.get('itemCondition'); }
  get itemDescription() { return this.firstForm.get('itemDescription'); }
  get itemPrice() { return this.firstForm.get('itemPrice'); }

  get ownerName() { return this.secondForm.get('ownerName'); }
  get ownerPhoneNumber() { return this.secondForm.get('ownerPhoneNumber'); }
  get pickupAddress() { return this.secondForm.get('pickupAddress'); }


  onSubmitStep1() {
    const priceCtrl = this.firstForm.get('itemPrice')!;
    if (this.uploadedUrls.length === 0) {
      this.showUploadError = true;
    }
    if (this.itemCondition.value === '')
      this.showItemConditionError = true;
    if (!this.showUploadError && !this.showItemConditionError && this.itemName.valid && this.itemType.valid) {
      // 1) grab the raw value, turn to string
      const raw = priceCtrl.value;
      const str = raw != null
        ? raw.toString()
        : '';

      // 2) strip out non-digits
      const cleaned = str.replace(/[^\d.-]/g, '');

      // 3) set it back as a number
      priceCtrl.setValue(cleaned === '' ? '' : parseFloat(cleaned));
      if (this.firstForm.valid) {
        console.log(this.firstForm.value);

        this.activeStep = 2;
        console.log(this.activeStep);

      }
    }
    else {
      this.firstForm.markAllAsTouched();
      return;
    }
  }

  onSubmitStep2() {
    if (this.secondForm.valid) {
      // instead of immediately going to the next step:
      const ok = window.confirm('האם אתה בטוח שאתה רוצה לפרסם את המודעה?');
      if (ok) {
        const yad2Item: Yad2 = {
          _id: '', // backend will assign
          ownerId: this.userService.getLoggedinUser()!._id, // there must be a logged in user cuz we have guard
          ownerPhoneNumber: this.ownerPhoneNumber.value,
          ownerName: this.ownerName.value,
          itemCondition: this.itemCondition.value,
          itemDescription: this.itemDescription.value,
          itemName: this.itemName.value,
          itemPrice: this.itemPrice.value,
          itemType: this.itemType.value,
          itemAddress: this.pickupAddress.value,
          itemExtraInfoBadge: this.getRandomExtraBadge(),
          images: this.uploadedUrls,

        };

        this.yad2Service.create(yad2Item).subscribe({
          next: createdItem => {
            console.log('Item created:', createdItem);
            this.router.navigate(['/home']).then(() => {
              window.location.reload();
            });
          },
          error: err => {
            console.error('Failed to create item', err);
          }
        });


      }
    } else {
      this.secondForm.markAllAsTouched();
    }
  }

  getRandomExtraBadge() {
    const conditions = [
      "חבל לפספס",
      "גמיש במחיר",
      "בהזדמנות",
      "אחריות בתוקף",
      "באריזה מקורית"
    ];
    const idx = Math.floor(Math.random() * conditions.length);
    return conditions[idx];
  }

  onBack() {
    if (this.activeStep == 1)
      window.history.back();
    else
      this.activeStep--;
  }

}
