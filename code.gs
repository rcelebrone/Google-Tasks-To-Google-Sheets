const IMPORTANT = "Importante";
const URGENT = "Urgente";
const OTHERS = "Circunstancial";

function main(){
  var taskLists = listTasks();
  var yesterday = referenceDate();
  var today = new Date().toLocaleDateString('pt-br');
  
  if (taskLists && taskLists.length > 0) { 
    for (var i = 0; i < taskLists.length; i++) {
      var taskList = taskLists[i];
      var tasks = tasksFromList(taskList.id);

      if(taskList.title == IMPORTANT) {
        var important = tasks.filter((it) => completedSince(yesterday,it));
        addToSheet(today, taskLists[i].title, important.length);
      }
      
      if(taskList.title == URGENT) {
        var urgent = tasks.filter((it) => completedSince(yesterday,it));
        addToSheet(today, taskLists[i].title, urgent.length);
      }
      
      if(taskList.title == OTHERS) {
        var others = tasks.filter((it) => completedSince(yesterday,it));
        addToSheet(today, taskLists[i].title, others.length);
      }
    }
  } else {
    Logger.log('No task lists found.');
  }
}

function completedSince(date, it){
  var dt = new Date(it.completed);
  return it.status == 'completed' && date < dt;
}

function referenceDate(){
  var dt = new Date();
  dt.setHours(-24);
  return dt;
}

function addToSheet(id, title, date, type){
  var activeSheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = activeSheet.getSheets()[0];

  sheet.appendRow([id, title, date, type]);
}

function listTasks(){
  return Tasks.Tasklists.list({
    maxResults: 10
  }).items;
}

function tasksFromList(listId){
  return Tasks.Tasks.list(listId,{
    showHidden: true
  }).items;
}
