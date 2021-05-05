function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    
    return Math.floor(Math.random() * (max - min)) + min;
}

// generate qnt questions, half of each operation (at default levels)
// level 0 => custom operations
// level 1 => easy [+, -]
// level 2 => medium [*, /]
export function generateQuestions( level=1, qnt=10, min=2, max=10, operations=null ) {
    let questions = [];
    let existingQuestions = {};

    if (level === 0) {
        return [];
    } else if (level === 1) {
        let qntQuestions = Math.ceil(qnt/2);
        for (let i = 0; i < qntQuestions; i++) {
            let currentQuestion = getSumQuestion(min, max);
            let customHash = `${currentQuestion.first}${currentQuestion.operation}${currentQuestion.second}`;
            
            while (existingQuestions[customHash] !== undefined) {
                currentQuestion = getSumQuestion(min, max);
                customHash = `${currentQuestion.first}${currentQuestion.operation}${currentQuestion.second}`;
            }

            questions.push(currentQuestion);
            existingQuestions[customHash] = true;
        }

        for (let i = qntQuestions; i < qnt; i++) {
            let currentQuestion = getSubtractionQuestion(min, max);
            let customHash = `${currentQuestion.first}${currentQuestion.operation}${currentQuestion.second}`;

            while (existingQuestions[customHash] !== undefined) {
                currentQuestion = getSubtractionQuestion(min, max);
                customHash = `${currentQuestion.first}${currentQuestion.operation}${currentQuestion.second}`;
            }

            questions.push(currentQuestion);
            existingQuestions[customHash] = true;
        }
    } else if (level === 2) {
        let qntQuestions = Math.ceil(qnt/2);
        for (let i = 0; i < qntQuestions; i++) {
            let currentQuestion = getMultiplicationQuestion(min, max);
            let customHash = `${currentQuestion.first}${currentQuestion.operation}${currentQuestion.second}`;

            while (existingQuestions[customHash] !== undefined) {
                currentQuestion = getMultiplicationQuestion(min, max);
                customHash = `${currentQuestion.first}${currentQuestion.operation}${currentQuestion.second}`;
            }

            questions.push(currentQuestion);
            existingQuestions[customHash] = true;
        }

        for (let i = qntQuestions; i < qnt; i++) {
            let currentQuestion = getDivisionQuestion(min, max);
            let customHash = `${currentQuestion.first}${currentQuestion.operation}${currentQuestion.second}`;

            while (existingQuestions[customHash] !== undefined) {
                currentQuestion = getDivisionQuestion(min, max);
                customHash = `${currentQuestion.first}${currentQuestion.operation}${currentQuestion.second}`;
            }

            questions.push(currentQuestion);
            existingQuestions[customHash] = true;
        }
    } else {
        return [];
    }

    return questions;
}

// question type: { first, second, operation, answer }

function getSumQuestion( min, max ) {
    let first = getRandomInt(min, max);
    let second = getRandomInt(min, max);

    return { first: first, second: second, operation: '+', answer: first+second };
}

function getSubtractionQuestion( min, max ) {
    let first = getRandomInt(min, max);
    let second = getRandomInt(min, max);

    if (first < second) {
        let tmp = first;
        first = second;
        second = tmp;
    }

    return { first: first, second: second, operation: '-', answer: first-second };
}

function getMultiplicationQuestion( min, max ) {
    let first = getRandomInt(min, max);
    let second = getRandomInt(min, max);

    return { first: first, second: second, operation: '*', answer: first*second };
}

function getDivisionQuestion( min, max ) {
    let first = getRandomInt(min, max);
    let second = getRandomInt(min, max);

    return { first: first*second, second: second, operation: '/', answer: first };
}