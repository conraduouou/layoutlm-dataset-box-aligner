# LayoutLM Dataset Box Aligner

A utility script run on server-side through Node.js, controlled through REST API.

There's nothing much to this project, really, more of a personal project to make a dataset for LayoutLM cleaner by combining same y-axis offset entries, effectively shrinking the annotations. 

Note, however, that after going through this utility script, manual checking of the annotations should be done again, for entries that have different labels could effectively be combined together and therefore lose valuable prediction data.

An important disclaimer:
*This does **NOT** necessarily improve the model!*

## Steps in installation

1. Download the repo.
2. Navigate to the downloaded repo's directory and open your terminal from there. Upon starting the terminal, run the following command to install the packages needed.
	```
	npm install
	```

## Guide

There must be two directories present in the project folder: `annotations` and `annotations-fixed`. The `annotations` directory contains the JSON files that themselves consist of the dataset, either for training or for testing. The `annotations-fixed` will contain the shrunk files replicated from the `annotations` directory.

The only endpoint that actually serves a purpose in this project is the **POST** *Fix resume JSON* endpoint. Usually, that would suffice for anyone's use-case, but in case one wants to see what this project does, one can supply the following request body:

```json
{
	"filename": "[name_of_file_in_annotated_directory].json"
}
```

... to see it done in a single JSON file.