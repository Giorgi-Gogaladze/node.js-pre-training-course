import { ToDoManager } from "./todo-manager";

const runtimeProcess = (globalThis as typeof globalThis & {
    process: { argv: string[]; exit(code?: number): never };
}).process;

async function main(): Promise<void>{
    const [command, ...args] = runtimeProcess.argv.slice(2);
    const manager = new ToDoManager();
    await manager.init();

    switch(command){
        case 'list': {
            const todos = await manager.list()
            for(const t of todos){
                console.log(`#${t.id} [${t.status}] ${t.title}`);
            };
            break;
        }
        case 'add': {
            const [title, description] = args;
            await manager.add(title, description);
            console.log('Added');
            console.log(await manager.list());
            break;
        }

        case 'complete': {
            await manager.complete(Number(args[0]));
            console.log('Completed.');
            console.log(await manager.list());
            break;
        }

        default: 
            console.log('Usage: list | add <title> [description] | complete <id>')
    }
}

main().catch((e) => {
    console.log('Error', e.message);
    runtimeProcess.exit(1);
})
