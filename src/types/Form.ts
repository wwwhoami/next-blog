export type FormRecord = Record<string, any>

export type Validators<FormRecordType extends FormRecord> = {
  [K in keyof FormRecordType]: (value: FormRecordType[K]) => boolean
}

export type FormErrors<FormRecordType> = {
  [K in keyof FormRecordType]: boolean
}
