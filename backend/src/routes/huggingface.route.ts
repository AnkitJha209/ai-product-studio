import { Router } from "express";
import { generateFromFalController, generateFromFalTxtController, generateFromFluxController, generateFromReplicateController, generateFromReplicateTxtController, generateFromWaveSpeedController, generateFromWSTxtController, generateFromZAIController } from "../controllers/huggingGen.controller";
import { verify } from "../middleware/authVerification";
import multer from 'multer'

const upload = multer({storage: multer.memoryStorage() })

export const genRouter : Router = Router()

genRouter.post('/flux-model-generation', verify, upload.single("image"), generateFromFluxController)
genRouter.post('/wavespeed-model-generation', verify, upload.single("image"), generateFromWSTxtController)
genRouter.post('/fal-model-generation', verify, upload.single("image"), generateFromFalTxtController)
genRouter.post('/zai-model-generation', verify, upload.single("image"), generateFromZAIController)
genRouter.post('/replicate-model-generation', verify, upload.single("image"), generateFromReplicateTxtController)
genRouter.post('/replicate-img-model-generation', verify, upload.single("image"), generateFromReplicateController)
genRouter.post('/ws-img-model-generation', verify, upload.single("image"), generateFromWaveSpeedController)
genRouter.post('/fal-img-model-generation', verify, upload.single("image"), generateFromFalController)