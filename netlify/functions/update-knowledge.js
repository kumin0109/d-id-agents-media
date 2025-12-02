exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { studentName, question, answer, isCorrect } = JSON.parse(event.body);
  const AGENT_ID = process.env.AGENT_ID || "v2_agt_qZ0WxpLj";
  const DID_API_KEY = process.env.DID_API_KEY;

  if (!DID_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API Key not configured' })
    };
  }

  try {
    const response = await fetch(`https://api.d-id.com/agents/${AGENT_ID}/knowledge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${DID_API_KEY}`
      },
      body: JSON.stringify({
        content: `[학생 답변 기록]\n이름: ${studentName}\n질문: ${question}\n답변: ${answer}\n정답 여부: ${isCorrect ? '정답' : '오답'}\n날짜: ${new Date().toLocaleString('ko-KR')}`
      })
    });

    const result = await response.json();

    return {
      statusCode: response.ok ? 200 : 400,
      body: JSON.stringify(result)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
