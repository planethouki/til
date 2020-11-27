module.exports = async function (context, req) {
    context.log("JavaScript HTTP trigger function processed a request.");

    // Importing required node.js modules
    var batch = require("azure-batch");

    // Replace values below with Batch Account details
    var accountName = process.env.BATCH_ACCOUNT_NAME;
    var accountKey = process.env.BATCH_ACCOUNT_KEY;
    var accountUrl = process.env.BATCH_ACCOUNT_URL;

    // Replace values with SAS URIs of the shell script file
    var sh_url =
        "https://raw.githubusercontent.com/Azure-Samples/azure-batch-samples/master/Node.js/GettingStarted/startup_prereq.sh";

    // Replace values with SAS URIs of the Python script file
    var scriptURI =
        "https://raw.githubusercontent.com/Azure-Samples/azure-batch-samples/master/Node.js/GettingStarted/processcsv.py";

    // Pool ID
    var poolId = process.env.BATCH_POOL_ID;

    // Job ID
    var jobId = "processcsvjob";

    // Create Batch credentials object using account name and account key
    var credentials = new batch.SharedKeyCredentials(accountName, accountKey);

    // Create Batch service client
    var batchClient = new batch.ServiceClient(credentials, accountUrl);

    var poolConfig = {};

    // Creating Batch Pool
    context.log("Getting pool with ID : " + poolId);

    var pool = await batchClient.pool.get(poolId, poolConfig);

    context.log("Creating job with ID : " + jobId);
    // Preparation Task configuraion object
    var jobPrepTaskConfig = {
        id: "installprereq",
        commandLine: "sudo sh startup_prereq.sh > startup.log",
        resourceFiles: [{ httpUrl: sh_url, filePath: "startup_prereq.sh" }],
        waitForSuccess: true,
        runElevated: true,
    };

    // Setting Batch Pool ID
    var poolInfo = { poolId: poolId };
    // Batch job configuration object
    var jobConfig = {
        id: jobId,
        displayName: "process csv files",
        jobPreparationTask: jobPrepTaskConfig,
        poolInfo: poolInfo,
    };

    // Submitting Batch Job

    var job = await batchClient.job.add(jobConfig);

    context.log("Creating tasks....");
    var containerList = ["con1", "con2", "con3", "con4"];
    for (let i = 0; i < containerList.length; i++) {
        var val = containerList[i];
        context.log("Submitting task for container : " + val);
        var containerName = val;
        var taskID = containerName + "_process";
        // Task configuration object
        var taskConfig = {
            id: taskID,
            displayName: "process csv in " + containerName,
            commandLine: "echo " + containerName,
            resourceFiles: [{ httpUrl: scriptURI, filePath: "processcsv.py" }],
        };

        var task = await batchClient.task.add(jobId, taskConfig);
        context.log(
            "Task for container : " +
                containerName +
                " submitted successfully"
        );
    }

    const name = req.query.name || (req.body && req.body.name);
    const responseMessage = name
        ? "Hello, " +
          name +
          ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage,
    };
};
