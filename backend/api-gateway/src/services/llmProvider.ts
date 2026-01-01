// Minimal provider stub. Replace with Azure OpenAI implementation.

export async function sendToModel(messages: any[], petContext?: any): Promise<AsyncIterable<string>> {
  async function* gen() {
    yield 'I am PetCare AI. I am not a veterinarian.';
    yield '\nPossible causes: dietary indiscretion, infection, toxin.';
    yield '\nSeek immediate care if seizures, collapse, or severe breathing difficulties.';
    yield '\nThis is not a diagnosis. Contact your veterinarian for medical advice.';
  }
  return gen();
}
