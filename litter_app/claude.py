# from exceptiongroup import catch
import os
from dotenv import load_dotenv
import json
import boto3
import base64
from urllib.parse import unquote

load_dotenv()
access_key = os.getenv('AWS_ACCESS_KEY')
secret_key = os.getenv('AWS_SECRET_KEY')


class ClaudeAPI:

    def __init__(self, path, latitude, longitude) -> None:
        path = 'public' + unquote(path)
        self.image_path = path
        self.latitude = latitude
        self.longitude = longitude
        self.access_key = access_key
        self.secret_key = secret_key

        self.system_instruction = """
            Act an expert in analysing image related to waste.
            you should analyze the image to identify the type of waste (e.g., plastic, organic, electronic) and estimate the level of waste present.
            based on image give a detail summary of waste.
            you should identify location as par latitude and longitude and give brief summary of surrounding location and how important it to be clean.
            you should also identify nearby landmarks relevant to waste disposal (e.g., recycling centers, waste facilities), assess the environmental impact, and estimate the number of people required for cleanup based on general government standards.
            Additionally, you should provide actionable cleaning suggestions tailored to the type of waste identified, complete with safety tips and presented in a step-by-step guide format. These suggestions are designed for individuals to perform immediately if needed
            You must give the response in a very strict JSON format as provided in the prompt.
        """

        self.prompt = '''
        Anaylse Image & location
        location : {
            "lat": {self.latitude},
            "lng": {self.longitude}
        }
        generate response like a Example below:
        example :
        Provide the response in JSON format with the following fields:
        {
        "Description": A brief summary of what input image is based on location and waste,
        "Type_of_waste": Choose option of type of waste answer from following option (eg. plastic, organic, paper,industrial, household, hazard,chemical,liquid, Mixed etc). If no waste is detected, set this to 'none',
        "location_summary": A very short string describing the location summary based on position & how waste is impacting the environment,
        "impact": A very short describtion of impact of waste on location & type & quantity of waste(less than 20 words),
        "impact_level": A string that rate impact of waste on environment based on surronding such as 'Harmful', 'Moderately Harmful','Less Harmful', 'Potentially Beneficial',
        "emergency": Identify Priority level like if is a 'cricital','High','Medium','Low','Routine' based on surronding, type of waste & level of waste,
        "reward": Give a reward score based on impact ,impact_level,emergency out of 100(eg 50), based on reduction of global carbon footprint.
        "Level_of_waste":  A string that rates the level of waste present such as 'low', 'mid', or 'high'. If no waste is detected, set this to 'none',
        "Nearby_landmarks": Find nearby landmarks based on location relevant to waste disposal (e.g., recycling centers, waste facilities) give response as list of landmarks with estimated distance like ['name':'','distance':'  in miles']. If not found set this to ['none'],
        "people_required": estimated the exact number of people required for cleanup waste based on general government standards,(eg. 3, 4 etc). If not needed set this to 0,
        "suggestion":  {
            "safety precautions": 3 precaution. if not needed set empty list.
            []
            "Steps": 5 steps.if not needed set empty list.
            []
            "Additional tips": 3 one line tips.if not needed set empty list.
            []
        }
        you should provide actionable cleaning suggestions tailored to the type of waste identified, complete with safety tips and presented in a step-by-step guide format.These suggestions are designed for individuals to perform immediately if needed
        }
        '''
        self.prompt = self.prompt.replace("{self.latitude}", str(self.latitude)).replace("{self.longitude}",
                                                                                         str(self.longitude))

        image_bytes = ''

        with open(self.image_path, "rb") as image_file:
            image_bytes = image_file.read()

        encoded_image = base64.b64encode(image_bytes).decode("utf-8")

        self.messages = [{
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/jpeg",
                        "data": encoded_image,
                    },
                },
                {"type": "text", "text": self.prompt},
            ],
        }]

        self.body = json.dumps({
            "messages": self.messages,
            "system": self.system_instruction,
            "max_tokens": 8192,
            "temperature": 0.2,
            "top_p": 0.95,
            "top_k": 0,
            "anthropic_version": "bedrock-2023-05-31"
        })

    def generate_content(self):
        bedrock_runtime = boto3.client(service_name='bedrock-runtime', region_name='us-east-1',
                                       aws_access_key_id=self.access_key, aws_secret_access_key=self.secret_key)
        response = bedrock_runtime.invoke_model(body=self.body, modelId='anthropic.claude-3-haiku-20240307-v1:0',
                                                accept="application/json", contentType="application/json")
        # print(response.get('body').read())
        cleaned_response = response.get('body').read()
        # cleaned_response = cleaned_response.replace("```json", "").replace("```", "").replace("\\n", "\n").replace("\\", "").strip()
        # print(cleaned_response)
        response_body = json.loads(cleaned_response)
        result = response_body.get('content', '')
        data = json.loads(result[0].get('text', ''))
        # print(result[0].get('text', ''))
        return data
