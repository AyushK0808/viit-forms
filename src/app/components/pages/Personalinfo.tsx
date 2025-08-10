import InputField from "../InputField";

interface PersonalInfo {
  name: string;
  regNumber: string;
  yearOfStudy: string;
  phoneNumber: string;
  branchSpecialization: string;
  gender: string;
  vitEmail: string;
  personalEmail: string;
  domain: string;
  additionalDomains: string;
  joinMonth: string;
  otherOrganizations: string;
  cgpa: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface PersonalInfoFormProps {
  formData: PersonalInfo;
  errors: ValidationErrors;
  onChange: (field: keyof PersonalInfo, value: string) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          id="name"
          label="Name"
          value={formData.name}
          onChange={(value) => onChange('name', value)}
          required
          placeholder="Your full name"
          error={errors.name}
        />
        <InputField
          id="regNumber"
          label="Registration Number"
          value={formData.regNumber}
          onChange={(value) => onChange('regNumber', value)}
          required
          placeholder="Your registration number"
          error={errors.regNumber}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          id="yearOfStudy"
          label="Year of Study"
          type="select"
          value={formData.yearOfStudy}
          onChange={(value) => onChange('yearOfStudy', value)}
          required
          options={['1st Year', '2nd Year', '3rd Year', '4th Year']}
          error={errors.yearOfStudy}
        />
        <InputField
          id="phoneNumber"
          label="Phone Number"
          type="tel"
          value={formData.phoneNumber}
          onChange={(value) => onChange('phoneNumber', value)}
          required
          placeholder="Your phone number"
          error={errors.phoneNumber}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          id="branchSpecialization"
          label="Branch and Specialization"
          value={formData.branchSpecialization}
          onChange={(value) => onChange('branchSpecialization', value)}
          required
          placeholder="e.g., CSE - AI/ML"
          error={errors.branchSpecialization}
        />
        <InputField
          id="gender"
          label="Gender"
          type="select"
          value={formData.gender}
          onChange={(value) => onChange('gender', value)}
          required
          options={['Male', 'Female', 'Other', 'Prefer not to say']}
          error={errors.gender}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          id="vitEmail"
          label="Email Address (VIT)"
          type="email"
          value={formData.vitEmail}
          onChange={(value) => onChange('vitEmail', value)}
          required
          placeholder="your.name@vitstudent.ac.in"
          error={errors.vitEmail}
        />
        <InputField
          id="personalEmail"
          label="Email Address (Personal)"
          type="email"
          value={formData.personalEmail}
          onChange={(value) => onChange('personalEmail', value)}
          required
          placeholder="your.personal@email.com"
          error={errors.personalEmail}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          id="domain"
          label="Domain"
          type="select"
          value={formData.domain}
          onChange={(value) => onChange('domain', value)}
          required
          options={['Tech', 'Design', 'Management']}
          error={errors.domain}
        />
        <InputField
          id="additionalDomains"
          label="Additional Domain(s) you've worked in"
          value={formData.additionalDomains}
          onChange={(value) => onChange('additionalDomains', value)}
          placeholder="e.g., Design, Marketing (optional)"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          id="joinMonth"
          label="When did you join the club?"
          type="select"
          value={formData.joinMonth}
          onChange={(value) => onChange('joinMonth', value)}
          required
          options={['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']}
          error={errors.joinMonth}
        />
        <InputField
          id="cgpa"
          label="CGPA as of today"
          type="number"
          value={formData.cgpa}
          onChange={(value) => onChange('cgpa', value)}
          required
          placeholder="e.g., 8.5"
          error={errors.cgpa}
        />
      </div>

      <InputField
        id="otherOrganizations"
        label="Are you an active part of any other VIT organisation?"
        type="textarea"
        value={formData.otherOrganizations}
        onChange={(value) => onChange('otherOrganizations', value)}
        required
        placeholder="Mention clubs, chapters, teams, etc. or write 'None'"
        error={errors.otherOrganizations}
      />
    </div>
  );
};

export default PersonalInfoForm;