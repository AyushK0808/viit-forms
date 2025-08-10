import InputField from "../InputField";
import RatingField from "../RatingFields";

// Board Review Interface
interface BoardReview {
  overallBoardPerformance: number;
  boardCommunication: number;
  boardAccessibility: number;
  boardDecisionMaking: number;
  mostEffectiveBoardMember: string;
  boardImprovementSuggestions: string;
  boardAppreciation: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface BoardReviewFormProps {
  formData: BoardReview;
  errors: ValidationErrors;
  onChange: (field: keyof BoardReview, value: string | number) => void;
}

// Board Review Form
const BoardReviewForm: React.FC<BoardReviewFormProps> = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      

      <div className="grid md:grid-cols-2 gap-6">
        <RatingField
          id="overallBoardPerformance"
          label="Rate the overall performance of the board (1-10)"
          value={formData.overallBoardPerformance}
          onChange={(value) => onChange('overallBoardPerformance', value)}
          required
        />
        <RatingField
          id="boardCommunication"
          label="How effectively does the board communicate with members? (1-10)"
          value={formData.boardCommunication}
          onChange={(value) => onChange('boardCommunication', value)}
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <RatingField
          id="boardAccessibility"
          label="How accessible are board members when you need help? (1-10)"
          value={formData.boardAccessibility}
          onChange={(value) => onChange('boardAccessibility', value)}
          required
        />
        <RatingField
          id="boardDecisionMaking"
          label="Rate the board's decision-making process (1-10)"
          value={formData.boardDecisionMaking}
          onChange={(value) => onChange('boardDecisionMaking', value)}
          required
        />
      </div>

      <InputField
        id="mostEffectiveBoardMember"
        label="Who do you think is the most effective board member and why?"
        type="textarea"
        value={formData.mostEffectiveBoardMember}
        onChange={(value) => onChange('mostEffectiveBoardMember', value)}
        required
        placeholder="Name and reasons for your choice"
        error={errors.mostEffectiveBoardMember}
      />

      <InputField
        id="boardImprovementSuggestions"
        label="What improvements would you suggest for the board?"
        type="textarea"
        value={formData.boardImprovementSuggestions}
        onChange={(value) => onChange('boardImprovementSuggestions', value)}
        required
        placeholder="Areas where the board can improve"
        error={errors.boardImprovementSuggestions}
      />

      <InputField
        id="boardAppreciation"
        label="What do you appreciate most about the current board?"
        type="textarea"
        value={formData.boardAppreciation}
        onChange={(value) => onChange('boardAppreciation', value)}
        required
        placeholder="Positive aspects of the board's work"
        error={errors.boardAppreciation}
      />
    </div>
  );
};

export default BoardReviewForm;