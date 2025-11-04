# Amimi Project Reflection

## What Went Well

### **Concept Design Architecture**

- **Separation of Concerns**: The concept-based architecture made it easy to reason about each piece of functionality independently
- **Modular Development**: Could work on Pairing, ConversationalAgent, and GroupConversation concepts separately without conflicts
- **Testability**: Each concept had clear boundaries, making unit testing straightforward

### **Synchronization Engine**

- **Declarative Orchestration**: Moving from imperative calls to declarative syncs in Assignment 4C improved code clarity
- **Authentication Pattern**: Once I understood the pattern for auth syncs, applying it to all endpoints was straightforward
- **Debugging**: The sync engine's logging (TRACE/VERBOSE) helped identify when syncs weren't matching

### **AI Integration**

- **Gemini API**: Integration was smooth, and prompt engineering allowed fine-tuning of Amimi's personality
- **Dual Prompts**: Creating separate prompt systems for private vs. shared chat gave Amimi appropriate context

---

## What Was Challenging

### **Synchronization Matching**

**Problem**: The Amimi sync for `@Amimi` mentions wasn't firing for days.

**Root Cause**: 
- Initially tried matching with specific input patterns `{ conversationId, content }`
- The sync engine requires exact matches, but `GroupConversation.sendMessage` is called with `{ conversationId, sender, content }`
- Empty input pattern `{}` was needed to match any call, then filter in `where` clause

**Lesson**: Understanding sync engine pattern matching is critical. Start with empty patterns and filter in `where` clauses rather than trying to match specific inputs.

### **Response Sync Pattern Matching**

**Problem**: Many endpoints timing out with 504 Gateway Timeout errors.

**Root Cause**: 
- Sync engine requires ALL fields in output pattern to be present
- Success responses have `{ status, messages }` but error responses have `{ status, error }`
- Single response sync couldn't match both

**Solution**: Split into separate `SuccessResponse` and `ErrorResponse` syncs for each action

**Lesson**: The sync engine is strict about pattern matching. Separate syncs for different output shapes are necessary.

### **Frontend State Management**

**Problem**: Conversation IDs becoming null, messages not appearing correctly, loading states incorrect.

**Root Cause**: 
- Multiple sources of truth (localStorage, refs, API responses)
- ObjectId vs string type inconsistencies
- Async operations not properly awaited

**Solution**: 
- Explicit string conversion for all IDs
- Proper async/await chains
- Validation before using stored values

**Lesson**: Be rigorous about type conversions, especially with MongoDB ObjectIds that can appear as strings or objects.

---

## Mistakes and Learnings

### 1. **Underestimating Type Safety**

- MongoDB ObjectIds caused constant string/Object issues
- Solution: Always convert to strings explicitly using `.toString()` or `String()`

### 2. **Async/Await Discipline**

- Missing `await` keywords led to race conditions
- Solution: Use `await` consistently, especially when operations must complete before proceeding

### 3. **Pattern Matching Assumptions**

- Assumed sync engine would match partial patterns
- Solution: Always test with actual action calls, use empty patterns when possible

### 4. **Frontend Architecture Simplification**

- Started planning complex component structure, ended with single-file component
- Lesson: Sometimes simpler is better for MVP; can refactor later when needed

---

## Skills Acquired

### Technical Skills

- **Concept-Based Architecture**: Deep understanding of independent, composable concepts
- **Synchronization Patterns**: Declarative orchestration using when/where/then clauses
- **Deno Development**: TypeScript runtime, MongoDB integration, testing
- **Vue.js 3 Composition API**: Reactive refs, lifecycle hooks, computed properties
- **AI Prompt Engineering**: Crafting prompts for empathetic, natural conversations
- **API Design**: RESTful endpoints, authentication patterns, error handling

### Problem-Solving Skills

- **Debugging Syncs**: Using logging to trace sync matching failures
- **Type System Debugging**: Identifying and fixing ObjectId/string mismatches
- **Async Flow Management**: Proper sequencing of API calls and state updates

---

## Skills to Develop Further

### Areas for Improvement

- **Test Coverage**: Could have written more comprehensive integration tests earlier
- **Error Handling**: Some error cases weren't caught until production testing
- **Performance**: Polling mechanism could be optimized; WebSockets would be better for real-time
- **Documentation**: Should have documented sync patterns earlier to avoid repeated mistakes

---

## Using the Context Tool

### Effective Uses

- **Reading Design Documents**: Used context tool to understand concept design principles
- **Exploring Codebase**: Found sync patterns, API endpoints, and concept implementations
- **Understanding Architecture**: Traced how concepts interact through synchronizations

### Lessons

- Context tool is most useful when searching for specific functionality or patterns
- Reading full files is better for understanding overall structure
- Combining context search with direct file reading provides comprehensive understanding

---

## Using Agentic Coding Tools (Cursor/ChatGPT)

### What Worked Well

- **Rapid Implementation**: Could describe features and get working code quickly
- **Debugging Assistance**: Describing errors led to targeted fixes
- **Code Refactoring**: Could request pattern changes and get comprehensive updates
- **Documentation**: Generating documentation from code was efficient

### Challenges

- **Hallucinations**: Tool sometimes suggested patterns that didn't match the actual codebase
- **Context Window**: Long conversations caused loss of early context
- **Understanding Requirements**: Sometimes needed clarification on sync engine behavior

### Effective Workflow

1. **Read code first**: Understand existing patterns before requesting changes
2. **Test incrementally**: Apply changes in small steps, test each
3. **Verify patterns**: Check that tool's suggestions match existing codebase conventions
4. **Manual review**: Always review generated code for correctness

---

## Conclusions: LLMs in Software Development

### Appropriate Roles

**Code Generation**: Excellent for boilerplate, repetitive patterns, API clients  
**Debugging**: Helpful for identifying common issues and suggesting fixes  
**Refactoring**: Good for applying patterns consistently across codebase  
**Documentation**: Efficient for generating docs from code  
**Learning**: Great for understanding new frameworks/libraries  

### Limitations

**System Design**: Requires deep understanding; LLMs can suggest bad patterns  
**Complex Debugging**: Can suggest wrong fixes when root cause isn't clear  
**Context Understanding**: May miss subtle requirements or constraints  
**Testing**: Generated tests often miss edge cases  

### Best Practices

1. **Verify Everything**: Don't trust generated code blindly; test thoroughly
2. **Understand Before Applying**: Read and understand patterns before using them
3. **Iterate Incrementally**: Make small changes, test, then proceed
4. **Use as Amplifier**: LLMs amplify your capabilities but don't replace understanding
5. **Review Carefully**: Always review generated code for correctness and maintainability

---

## Final Thoughts

This project demonstrated both the power and limitations of LLM-assisted development. The concept-based architecture provided a solid foundation, and the sync engine migration taught valuable lessons about declarative programming. While there were frustrating debugging sessions (especially with sync matching), each challenge provided deeper understanding of the system.

The key takeaway: **LLMs are powerful tools for implementation and debugging, but understanding system architecture and design principles remains essential for making good decisions.**

