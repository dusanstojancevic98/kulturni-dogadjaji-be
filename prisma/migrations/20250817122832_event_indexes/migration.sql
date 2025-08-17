-- CreateIndex
CREATE INDEX "Event_dateTime_idx" ON "Event"("dateTime");

-- CreateIndex
CREATE INDEX "Event_type_idx" ON "Event"("type");

-- CreateIndex
CREATE INDEX "Event_institutionId_idx" ON "Event"("institutionId");

-- CreateIndex
CREATE INDEX "Event_createdById_idx" ON "Event"("createdById");

-- CreateIndex
CREATE INDEX "Event_title_idx" ON "Event"("title");
