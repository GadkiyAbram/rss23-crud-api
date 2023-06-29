export const checkRequiredFields = (requiredFields: string[], fields: string[]) => {
    return requiredFields.every((field) => fields.includes(field) &&
        fields.every((newField) => requiredFields.includes(newField)));
}