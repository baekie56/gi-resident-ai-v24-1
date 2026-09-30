const test=require('node:test');
const assert=require('node:assert/strict');
const A=require('../js/assessment-data.js');

test('assessment is a versioned 10-item single-choice bank',()=>{
  assert.match(A.ID,/v1$/);
  assert.match(A.VERSION,/^\d{4}-\d{2}-\d{2}\.\d+$/);
});

test('assessment questions are complete and uniquely identified',()=>{
  assert.equal(A.QUESTIONS.length,10);
  assert.equal(new Set(A.QUESTIONS.map(q=>q.id)).size,10);
  for(const q of A.QUESTIONS){
    assert.ok(q.question.length>=12);assert.equal(q.options.length,4);
    assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length);
    assert.ok(q.explanation.length>=12);assert.ok(q.source.length>=6);
  }
  assert.ok(new Set(A.QUESTIONS.map(q=>q.domain)).size>=5);
});

test('assessment scoring returns 0, partial, and 100 percent',()=>{
  const correct=A.QUESTIONS.map(q=>q.answer);
  assert.deepEqual(A.score(correct),{correct:10,total:10,percent:100});
  const wrong=A.QUESTIONS.map(q=>(q.answer+1)%q.options.length);
  assert.deepEqual(A.score(wrong),{correct:0,total:10,percent:0});
  const half=correct.map((x,i)=>i<5?x:(x+1)%4);
  assert.deepEqual(A.score(half),{correct:5,total:10,percent:50});
});
