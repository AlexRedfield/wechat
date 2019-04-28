pragma solidity ^0.5.0;

contract TaskManage{
    address payable public owner;

    modifier onlyOwner() {
        require (msg.sender == owner);
        _;
    }
    
    
    struct Task{
        string name;
        uint id;
        address payable worker;
        address payable customer;
        uint flag;
        uint price;
        string sort;
        uint date;
        string info;
        uint status;
    }
    //event NewTask(address,address,uint,uint,string,uint,string,uint);
    
    //mapping(address => Task[]) public tasks;
    Task[] public tasks;
    
    mapping(address => Task[]) public allTasks;

    constructor() public{
        owner=msg.sender;
    }
    
    function getTasksLen(address own) public view returns(uint){
        return allTasks[own].length;
    }
    

    function createTask(string memory name, uint flag, uint price, string memory sort, uint date, string memory info) public {
        //if(flag==0) //发起者是提供服务的
        allTasks[msg.sender].push(
            Task({
                name:name,
                id:getTasksLen(msg.sender),
                worker:msg.sender,
                customer:msg.sender, 
                flag:flag,
                price:price,
                sort:sort,
                date:date,
                info:info,
                status:0    //status为0表示任务刚发起
            })
        );
    }
    
    //服务者接单，因此没有date
    function acceptTask(address payable worker, uint id) public {
        Task storage task=allTasks[worker][id];
        require(task.flag==1&&task.status==0);
        //worker.transfer(task.price*3/10);
        task.status=1;  //该任务已付定金
    }

        //客户购买服务
    function buyTask(address payable worker, uint id, uint date) public {
        Task storage task=allTasks[worker][id];
        require(task.flag==0&&task.status==0);
        task.date=date;
        task.status=1;  //该任务已付定金
    }
    
    function taskFinish(address payable user, uint id,uint flag) public {
        Task storage task=allTasks[user][id];
        require(task.status==1&&flag==1);    //flag指代客户确认任务已完成
        task.status=2;  //该任务已完成
    }    
}