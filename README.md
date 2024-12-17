# emulator-example

A barebones event-sourcing system demonstrating Ambar's [emulator](https://github.com/ambarltd/emulator) usage.

The system is a simple event-sourced banking application where users can add and withdraw funds from their accounts.

## Run

Start the system with

```
docker-compose up
```

You will see messages being printed to the screen as they are consumed from `events.database` and projected
to the `service-projections`.

A dashbard will be avaiable at `http://localhost:8080` showing the data consumed in the projections.

### Reset

```
docker-compose down
```

This will delete all container state and restart the projections from the beginning.

