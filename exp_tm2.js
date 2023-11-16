import * as THREE from "three";
import { MindARThree } from 'mindar-image-three';

document.addEventListener("DOMContentLoaded", () => {

	const start = async() => {
	      const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "assets/cap.mind"
      		});
	        const {renderer, scene, camera, video} = mindarThree;
		const anchor = mindarThree.addAnchor(0);


		// the link to your model provided by Teachable Machine export panel

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
		const model = await tmImage.load("assets/model/model.json", "assets/model/metadata.json");
		const maxPredictions = model.getTotalClasses();
//		console.log("maxPredictions = ", maxPredictions);
//		console.log("video = ", video);

		await mindarThree.start();
		renderer.setAnimationLoop(async() => {
  			// predict can take in an image, video or canvas html element
			const prediction = await model.predict(video);
			let str = "Визначено: ";
			for (let i = 0; i < maxPredictions; i++) 
				str = str + prediction[i].className + ": " + prediction[i].probability.toFixed(2) + "\n";
			console.log(str);
		  	renderer.render(scene, camera);
		});

	}
	start();
});

/*

<div id="webcam-container"></div>
<div id="label-container"></div>
<script type="text/javascript">

</script>
*/
