import questionData from '../quiz/question.data';
import Question from '../quiz/question.model';
import Quiz from '../quiz/quiz.model';
import QuizAnswers from '../quiz/quiz-answers.model';
import Answer from '../quiz/quiz-answer.model';

export default class QuizSampleService {
	static getTestQuiz(): Quiz {
        let questions: Question[] = questionData;
		return { questions };
	}

	static getQuizAnswers(quiz: Quiz, indices: number[]): QuizAnswers {
        let answers: Answer[] = quiz.questions.map((q, i) => new Answer(q, indices[i]));
        return new QuizAnswers(answers, 1);
    }

    static getMoleQuizAnswers(quiz: Quiz): QuizAnswers {
        return QuizSampleService.getQuizAnswers(quiz, quiz.questions.map(q => 0));
    }
    
    // Three quarter answers are correct
    static getGreatQuizAnswers(moleQuizAnswers: QuizAnswers, time: number): QuizAnswers {
        let indices: number[] = []
        for (let i = 0; i < moleQuizAnswers.answers.length; i++) {
            let answer = moleQuizAnswers.answers[i];
            if (i <= moleQuizAnswers.answers.length / 4) {
                indices.push((answer.answerIndex + 1) % answer.question.choices.length);
            } else {
                indices.push(answer.answerIndex);
            }
        }
        return new QuizAnswers(indices.map((i, index) => new Answer(moleQuizAnswers.answers[index].question, i)), time);
    }

    // Half of all answers are correct
    static getGoodQuizAnswers(moleQuizAnswers: QuizAnswers, time: number) {
        let indices: number[] = []
        for (let i = 0; i < moleQuizAnswers.answers.length; i++) {
            let answer = moleQuizAnswers.answers[i];
            if (i % 2 === 0) {
                indices.push((answer.answerIndex + 1) % answer.question.choices.length);
            } else {
                indices.push(answer.answerIndex);
            }
        }
        return new QuizAnswers(indices.map((i, index) => new Answer(moleQuizAnswers.answers[index].question, i)), time);
    }

    // Three quarter answers are wrong
    static getBadQuizAnswers(moleQuizAnswers: QuizAnswers, time: number) {
        let indices: number[] = []
        for (let i = 0; i < moleQuizAnswers.answers.length; i++) {
            let answer = moleQuizAnswers.answers[i];
            if (i >= moleQuizAnswers.answers.length / 4) {
                indices.push((answer.answerIndex + 1) % answer.question.choices.length);
            } else {
                indices.push(answer.answerIndex);
            }
        }
        return new QuizAnswers(indices.map((i, index) => new Answer(moleQuizAnswers.answers[index].question, i)), time);
    }

    // All answers are wrong
    static getLoserQuizAnswers(moleQuizAnswers: QuizAnswers, time: number) {
        let indices: number[] = []
        for (let i = 0; i < moleQuizAnswers.answers.length; i++) {
            let answer = moleQuizAnswers.answers[i];
            if (i >= moleQuizAnswers.answers.length / 4) {
                indices.push((answer.answerIndex + 1) % answer.question.choices.length);
            } else {
                indices.push(answer.answerIndex);
            }
        }
        return new QuizAnswers(indices.map((i, index) => new Answer(moleQuizAnswers.answers[index].question, i)), time);
    }
}
