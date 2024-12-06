# Speaker Transcription and User Diarisation

## Project Overview
An advanced speech transcription system with user diarization that leverages machine learning technologies to provide precise, speaker-labeled transcripts. By integrating OpenAI's Whisper and advanced speaker recognition techniques, the project delivers high-quality transcription that can distinguish between multiple speakers in complex audio environments.

## Project Structure
- Frontend: Next.js Application
- Backend: Jupyter Notebook (Kaggle-hosted)

## Prerequisites
- Node.js (v16 or later)
- Kaggle Account
- ngrok Account
- Hugging Face Token


## Backend Setup (Kaggle)

### 1. Prepare Hugging Face Token
- Go to Hugging Face: https://huggingface.co/
- Create an account or log in
- Generate an access token

### 2. Prepare ngrok Token
- Go to ngrok: https://ngrok.com/
- Create an account
- Get your authentication token

### 3. Import Notebook to Kaggle
1. Open Kaggle Notebooks
2. Click "New Notebook"
3. Import notebook from GitHub
4. Select the Jupyter Notebook file
>Notebook link: [https://www.kaggle.com/code/vishaljx/major0-0-1][https://www.kaggle.com/code/vishaljx/major0-0-1] 

### 4. Configure Notebook in Kaggle
- Enable GPU acceleration
- Replace Hugging Face token:
  ```python
  hf_token = 'your-huggingface-token-here'
  ```
- Replace ngrok authentication token:
  ```python
  NGROK_AUTH_TOKEN = 'your-ngrok-token-here'
  ```

### 5. Run the Notebook
- Execute all cells
- Note the generated ngrok public URL

### 6. Update Frontend Environment
- Copy the ngrok URL from Kaggle output
- Paste in frontend's `.env.local`
  ```bash
  NEXT_PUBLIC_BACKEND_URI=https://generated-ngrok-uri.ngrok.app
  ```


## Frontend Setup (Next.js)

### 1. Clone the Repository
```bash
git clone <your-frontend-repository-url>
cd <frontend-project-directory>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
Create a `.env.local` file in the project root:
```bash
NEXT_PUBLIC_BACKEND_URI=https://your-ngrok-uri.ngrok.app
```

### 4. Run Development Server
```bash
npm run dev
```
- Frontend will be available at `http://localhost:3000`

## Workflow After Backend Deployment

### 1. Speaker Enrollment Process (Frontend)
1. Open the frontend application
2. Navigate to the "Speaker Enrollment" page
3. Click "Add Speakers"
4. Enter the number of speakers to enroll
5. For each speaker:
   - Enter speaker name
   - Upload a short audio sample (3-5 seconds recommended)
6. Click "Enroll Speakers" button
7. Wait for enrollment confirmation

### 2. Transcription Process (Frontend)
1. After successful speaker enrollment, go to the "Transcription" page
2. Click "Upload Conversation Audio"
3. Select the multi-speaker audio file to transcribe
4. Click "Start Transcription"
5. Wait for processing (may take a few minutes)
6. View results:
   - Detailed transcript
   - Speaker labels
   - Timestamp information
   - Speaker confidence scores

## Key Workflow Notes
🚨 **Important**:
- Entire user enrollment and transcription is done through the frontend
- Backend (Kaggle notebook) only needs to be run once to establish the ngrok URI
- Every frontend interaction happens via the generated ngrok URL
- Refresh ngrok URI if the Kaggle notebook is restarted

## Important Considerations
- ngrok URL changes on every Kaggle notebook restart
- Always update `NEXT_PUBLIC_BACKEND_URI`
- Requires GPU for optimal performance
- Currently supports English language

## Troubleshooting
- Verify Hugging Face token permissions
- Ensure ngrok token is valid
- Check GPU is enabled in Kaggle
- Confirm frontend environment variables

## Limitations
- Temporary backend URL
- Requires consistent token management
- English language only

## Future Enhancements
- Multilingual support
- Real-time processing
- Improved speech overlap handling


## Collaboration Credits
**Harsh Jain**
- GitHub: [https://github.com/HarshJa1n](https://github.com/HarshJa1n)


## Acknowledgements
- WhisperX
- Speechbrain
- FastAPI
- ngrok
- Hugging Face



