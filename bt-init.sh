#!/bin/bash
sudo systemctl stop bluetooth
sudo hciconfig hci0 up
