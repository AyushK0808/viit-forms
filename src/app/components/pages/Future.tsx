import InputField from "../InputField";
import RatingField from "../RatingFields";

// Future Interface
interface Future {
  whyJoinedVinnovateIT: string;
  wishlistFulfillment: string;
  commitmentRating: number;
  commitmentJustification: string;
  leadershipPreference: string;
  immediateChanges: string;
  upcomingYearChanges: string;
  preferredFellowLeaders: string;
  skillsToLearn: string;
  domainsToExplore: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface FutureFormProps {
  formData: Future;
  errors: ValidationErrors;
  onChange: (field: keyof Future, value: string | number) => void;
}

// Future Form
const FutureForm: React.FC<FutureFormProps> = ({ formData, errors, onChange }) => {
  const leadershipOptions = [
    { value: "board", label: "Board Position" },
    { value: "senior_core", label: "Senior Core" },
    { value: "both", label: "Either Board or Senior Core" },
    { value: "neither", label: "Neither" }
  ];

  return (
    <div className="space-y-6">
      

      <InputField
        id="whyJoinedVinnovateIT"
        label="Why did you join VinnovateIT?"
        type="textarea"
        value={formData.whyJoinedVinnovateIT}
        onChange={(value) => onChange('whyJoinedVinnovateIT', value)}
        required
        placeholder="Your motivations and expectations when joining"
        error={errors.whyJoinedVinnovateIT}
      />

      <InputField
        id="wishlistFulfillment"
        label="Have you been able to fulfill your above wishlist? Are there some things that still remain unfulfilled?"
        type="textarea"
        value={formData.wishlistFulfillment}
        onChange={(value) => onChange('wishlistFulfillment', value)}
        required
        placeholder="What has been achieved and what remains"
        error={errors.wishlistFulfillment}
      />

      <RatingField
        id="commitmentRating"
        label="Between 1-10, how committed are you to the future of this club?"
        value={formData.commitmentRating}
        onChange={(value) => onChange('commitmentRating', value)}
        required
      />

      <InputField
        id="commitmentJustification"
        label="Justify your above rating so that we can believe you"
        type="textarea"
        value={formData.commitmentJustification}
        onChange={(value) => onChange('commitmentJustification', value)}
        required
        placeholder="Explain your level of commitment with examples"
        error={errors.commitmentJustification}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Do you want to lead the club from a board position/senior core? Choose which would you prefer.
        </label>
        <select
          value={formData.leadershipPreference}
          onChange={(e) => onChange('leadershipPreference', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select preference</option>
          {leadershipOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.leadershipPreference && (
          <p className="mt-1 text-sm text-red-600">{errors.leadershipPreference}</p>
        )}
      </div>

      <InputField
        id="immediateChanges"
        label="If you could lead the club, what changes would you bring right now?"
        type="textarea"
        value={formData.immediateChanges}
        onChange={(value) => onChange('immediateChanges', value)}
        required
        placeholder="Immediate improvements and changes you would implement"
        error={errors.immediateChanges}
      />

      <InputField
        id="upcomingYearChanges"
        label="If you could lead the club, what changes would you bring in the upcoming year?"
        type="textarea"
        value={formData.upcomingYearChanges}
        onChange={(value) => onChange('upcomingYearChanges', value)}
        required
        placeholder="Long-term vision and strategic changes"
        error={errors.upcomingYearChanges}
      />

      <InputField
        id="preferredFellowLeaders"
        label="Mention a few teammates that you would like as your fellow leaders"
        type="textarea"
        value={formData.preferredFellowLeaders}
        onChange={(value) => onChange('preferredFellowLeaders', value)}
        required
        placeholder="Names and reasons for your choices"
        error={errors.preferredFellowLeaders}
      />

      <InputField
        id="skillsToLearn"
        label="What are some skills you want to learn in the club?"
        type="textarea"
        value={formData.skillsToLearn}
        onChange={(value) => onChange('skillsToLearn', value)}
        required
        placeholder="Technical and soft skills you want to develop"
        error={errors.skillsToLearn}
      />

      <InputField
        id="domainsToExplore"
        label="What are some roles/domains you wanna explore in the club?"
        type="textarea"
        value={formData.domainsToExplore}
        onChange={(value) => onChange('domainsToExplore', value)}
        required
        placeholder="Areas of interest you want to explore"
        error={errors.domainsToExplore}
      />
    </div>
  );
};

export default FutureForm;