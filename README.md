# create terraftom module in terraform cloud action
This action is used to create a terraform module within an organazation in terraform cloud

## Usage
will be updated once we have it released to set the verison and action name correctlly ...

## Inputs

-   `module_name`: The name of the terraform module to be created create (e.g. `"DynamoDB"`)

-   `provider`: The module  used provider (e.g. `"aws"`)

-   `organization`:  The terrafrom cloud organization to have the module created in (e.g. `"staging"`)

- `registry_name`: spicify either the moduele is  public | private 
 

## Outputs
-   `response`: the  returned response from create module api call 